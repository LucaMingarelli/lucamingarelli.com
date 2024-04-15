from connectors import web as requests
# import requests
import pandas as pd

base = 'http://stats.oecd.org/sdmx-json/data/'
param = [('dataset', 'QNA'),
         ('country', 'FRA+ITA+ESP+GBR+CAN+DEU'),
         ('indicators', 'GDP+B1_GE.CUR+VOBARSA'), 
         ('freq', 'Q'), 
         ('start_date' , '?startTime=1999-Q4')
        ]

series = '.'.join(x[1] for x in param[1:-1])
url = '{}{}/{}{}'.format(base, param[0][1], series, param[-1][1])

r = requests.get(url).json()

date_list = r['structure']['dimensions']['observation'][0]['values']
dates = pd.to_datetime([x['id'] for x in date_list])
    
areas = [v['name'] for v in r['structure']['dimensions']['series'][0]['values']]

title = r['structure']['dimensions']['series'][1]['values'][0]['name']

df = pd.DataFrame()
for i, area in enumerate(areas):
    s_key = '{}:0:0:0'.format(i)
    s_list = r['dataSets'][0]['series'][s_key]['observations']
    df[area] = pd.Series([s_list[val][0] for val in sorted(s_list, key=int)])
    df[area] = (((df[area]/df[area].shift())**4)-1)*100




