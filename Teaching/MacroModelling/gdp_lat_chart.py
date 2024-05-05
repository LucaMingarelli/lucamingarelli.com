"""  Created on 05/05/2024::
------------- gdp_by_latitude.py -------------
 
**Authors**: L. Mingarelli
"""
import pandas as pd
import pylab as plt
import seaborn as sns
%config InlineBackend.figure_format = 'svg'
sns.set(rc={'axes.facecolor':'#DCDCDC' ,'figure.facecolor':'#DCDCDC'})


gdp_lat = pd.DataFrame([
['50°-59°', 0.8363047001620747],
['40°-49°', 0.8444084278768234],
['30°-39°', 0.47001620745542955],
['20°-29°', 0.07779578606158831],
['10°-19°', 0.05024311183144245],
['0°-9°', 0.07779578606158831],
['10°-19°', 0.07779578606158831],
['20°-29°', 0.11021069692058344],
['30°-39°', 0.3549432739059968],
['40°-49°', 0.7747163695299839],
['50°-59°', 0.9692058346839546],
['60°-69°', 0.7633711507293355],
], columns=['lat', 'gdp_pc']).set_index('lat') * 12000/0.969206

gdp_lat.index = ['50°S', '40°S', '30°S', '20°S',
                 '10°S', '0°', '10°N', '20°N',
                 '30°N°', '40°N', '50°N°', '60°N°']


gdp_lat.plot.bar(legend=False, rot=0, color='black')
plt.xlabel('')
plt.tight_layout()
plt.savefig("Teaching/MacroModelling/gdp_lat_chart.svg", transparent=True)
plt.show()






