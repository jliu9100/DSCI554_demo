import json

import pandas as pd
import requests

fips = {
    1: "Alameda", 3: "Alpine", 5: "Amador", 7: "Butte",
    9: "Calaveras", 11: "Colusa", 13: "Contra Costa", 15: "Del Norte",
    17: "El Dorado", 19: "Fresno", 21: "Glenn", 23: "Humboldt",
    25: "Imperial", 27: "Inyo", 29: "Kern", 31: "Kings",
    33: "Lake", 35: "Lassen", 37: "Los Angeles", 39: "Madera",
    41: "Marin", 43: "Mariposa", 45: "Mendocino", 47: "Merced",
    49: "Modoc", 51: "Mono", 53: "Monterey", 55: "Napa",
    57: "Nevada", 59: "Orange", 61: "Placer", 63: "Plumas",
    65: "Riverside", 67: "Sacramento", 69: "San Benito", 71: "San Bernardino",
    73: "San Diego", 75: "San Francisco", 77: "San Joaquin", 79: "San Luis Obispo",
    81: "San Mateo", 83: "Santa Barbara", 85: "Santa Clara", 87: "Santa Cruz",
    89: "Shasta", 91: "Sierra", 93: "Siskiyou", 95: "Solano",
    97: "Sonoma", 99: "Stanislaus", 101: "Sutter", 103: "Tehama",
    105: "Trinity", 107: "Tulare", 109: "Tuolumne", 111: "Ventura",
    113: "Yolo", 115: "Yuba",
}

def process():
    df = pd.read_csv("CA_Fires_05to15.csv")

    df = df[['OBJECTID', 'FIRE_YEAR', 'CONT_DOY', 'STAT_CAUSE_DESCR', 'LATITUDE', 'LONGITUDE',
             'NWCG_REPORTING_UNIT_NAME', 'MTBS_ID', 'FIPS_NAME', 'FIRE_SIZE']].copy()
    df.rename(columns={
        'OBJECTID': 'oid',
        'FIRE_YEAR': 'ignition_year',
        'CONT_DOY': 'ignition_day',
        'STAT_CAUSE_DESCR': 'cause_description',
        'LATITUDE': 'latitude',
        'LONGITUDE': 'longitude',
        'NWCG_REPORTING_UNIT_NAME': 'report_location',
        'MTBS_ID': 'mtbs_id',
        'FIPS_NAME': 'county',
        'FIRE_SIZE': 'fire_size'
    }, inplace=True)
    df = df[df['oid'].notnull()]
    print(len(df))
    #
    # fips_str = {str(key).zfill(3): value for key, value in fips.items()}
    # df['county'] = df['county'].fillna("Unknown")

    # df.to_json("CA_Fires.json", orient='records', lines=False)

def count():
    df = pd.read_csv("CA_Fires_05to15.csv")
    df = df[['STAT_CAUSE_DESCR']].copy()
    cause_counts = df['STAT_CAUSE_DESCR'].value_counts()
    cause_counts.rename('cause', inplace=True)
    # 构建所需的 JSON 结构
    result_json = [{'name': cause, 'count': int(count)} for cause, count in cause_counts.items()]

    # 将结果转换为 JSON 字符串
    result_json_str = json.dumps(result_json, indent=4)

    # 保存为 JSON 文件
    with open('cause_counts.json', 'w') as file:
        file.write(result_json_str)

def count_by_year():
    df = pd.read_csv("CA_Fires_05to15.csv")
    df = df[['STAT_CAUSE_DESCR', 'FIRE_YEAR']].copy()
    cause_counts_by_year = df.groupby(['FIRE_YEAR', 'STAT_CAUSE_DESCR']).size().reset_index(name='count')
    # 转换为所需的 JSON 结构
    result_json = []
    for year in cause_counts_by_year['FIRE_YEAR'].unique():
        year_data = cause_counts_by_year[cause_counts_by_year['FIRE_YEAR'] == year]
        causes = [{'name': row['STAT_CAUSE_DESCR'], 'count': int(row['count'])} for index, row in year_data.iterrows()]
        year_entry = {'year': int(year), 'cause': causes}  # 确保年份也是原生 int 类型
        result_json.append(year_entry)

    # 尝试将结果转换为 JSON 字符串
    result_json_str = json.dumps(result_json, indent=4)

    # 保存为 JSON 文件
    with open('cause_counts_years.json', 'w') as file:
        file.write(result_json_str)

def count_class_year():
    df = pd.read_csv("CA_Fires_05to15.csv")
    df = df[['FIRE_YEAR', 'STAT_CAUSE_DESCR', 'FIRE_SIZE_CLASS']].copy()
    df.rename(columns={
        'FIRE_SIZE_CLASS': 'size_class',
        'STAT_CAUSE_DESCR': 'cause',
        'FIRE_YEAR': 'year'
    }, inplace=True)

    # Group by year and size_class, then count each cause
    cause_counts = df.groupby(['year', 'size_class'])['cause'].value_counts().unstack(fill_value=0)

    # Convert to JSON format
    json_data = []
    for year, group in cause_counts.groupby(level=0):
        year_data = {"year": year, "classes": []}
        for size_class, row in group.iterrows():
            causes = [{"name": cause_name, "count": count} for cause_name, count in row.items()]
            class_data = {"class": size_class, "cause": causes}
            year_data["classes"].append(class_data)
        json_data.append(year_data)

    # Write JSON data to a file
    with open('cause_class_years.json', 'w') as file:
        json.dump(json_data, file, indent=4)

def count_class():
    df = pd.read_csv("CA_Fires_05to15.csv")
    df = df[['STAT_CAUSE_DESCR', 'FIRE_SIZE_CLASS']].copy()
    df.rename(columns={
        'FIRE_SIZE_CLASS': 'size_class',
        'STAT_CAUSE_DESCR': 'cause',
    }, inplace=True)
    cause_counts = df.groupby('size_class')['cause'].value_counts().unstack(fill_value=0)
    json_data = []

    for size_class, row in cause_counts.iterrows():
        causes = []
        for cause_name, c in row.items():
            causes.append({"name": cause_name, "count": c})

        class_data = {
            "class": size_class,
            "cause": causes
        }
        json_data.append(class_data)

    with open('cause_class.json', 'w') as file:
        json.dump(json_data, file, indent=4)


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    # process()
    # count()
    # count_by_year()
    # count_class()
    count_class_year()

