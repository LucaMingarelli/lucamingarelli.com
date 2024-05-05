"""  Created on 05/05/2024::
------------- fredapi.py -------------
 
**Authors**: L. Mingarelli
"""
import numpy as np, pandas as pd
import pylab as plt
import seaborn as sns
%config InlineBackend.figure_format = 'svg'
sns.set(rc={'axes.facecolor':'#DCDCDC' ,'figure.facecolor':'#DCDCDC'})

from sklearn.linear_model import LinearRegression
from fredapi import Fred


fred = Fred(api_key='6d0d2962ffaa5bf7eb12a6ac666d4ff9')


# df = np.log10(fred.get_series('A939RX0Q048SBEA'))
df = fred.get_series('A939RX0Q048SBEA')





s,e = 225,242
x0 = df.index[s:e].values
x0_ = pd.to_datetime(x0).astype(np.int64).values / 1e19

reg = LinearRegression().fit(x0_.reshape(-1,1), df[s:e].values)
a, b = round(reg.coef_[0], 3), round(reg.intercept_, 3)


# plt.plot(x0, x0_*a+b, linewidth=2.5, color='red')
###########
x = df.index[241:260].values
x_ = pd.to_datetime(x).astype(np.int64).values / 1e19
plt.plot(x, 
         x_*10**(5.414) - x_[0]*10**(5.414) + df.iloc[241],
         linewidth=1, linestyle='dashed', color='black')
###########
x = df.index[171:190].values
x_ = pd.to_datetime(x).astype(np.int64).values / 1e19
plt.plot(x, 
         x_*10**(5.464) - x_[0]*10**(5.464) + df.iloc[171],
         linewidth=1, linestyle='dashed', color='black')
###########
x = df.index[127:146].values
x_ = pd.to_datetime(x).astype(np.int64).values / 1e19
plt.plot(x, 
         x_*10**(5.562) - x_[0]*10**(5.562) + df.iloc[127],
         linewidth=1, linestyle='dashed', color='black')
###########
x = df.index[76:95].values
x_ = pd.to_datetime(x).astype(np.int64).values / 1e19
plt.plot(x,
         x_*10**(5.607) - x_[0]*10**(5.607) + df.iloc[76],
         linewidth=1, linestyle='dashed', color='black')
###########
df.plot(color='k', ax=plt.gca(), zorder=1)
plt.xlim(df.index[52], df.index[-1])

plt.ylim(1.8e4,7e4)
plt.yscale('log')
plt.yticks([2e4, 3e4, 4e4, 5e4, 6e4, 7e4], ['20k','30k','40k','50k','60k','70k'])
plt.tight_layout()
plt.savefig("Teaching/MacroModelling/AK_shock_persistence_chart.svg", transparent=True)
plt.show()

# x = df.index[241:260].values
# x_ = pd.to_datetime(x).astype(np.int64).values / 1e19
# plt.plot(x, x_*2.914-x_[0]*2.914+df.iloc[241], linewidth=1, linestyle='dashed', color='black')
# ###########
# x = df.index[171:190].values
# x_ = pd.to_datetime(x).astype(np.int64).values / 1e19
# plt.plot(x, x_*3.764-x_[0]*3.764+df.iloc[171], linewidth=1, linestyle='dashed', color='black')
# ###########
# x = df.index[127:146].values
# x_ = pd.to_datetime(x).astype(np.int64).values / 1e19
# plt.plot(x, x_*5.492-x_[0]*5.492+df.iloc[127], linewidth=1, linestyle='dashed', color='black')
# ###########
# x = df.index[76:95].values
# x_ = pd.to_datetime(x).astype(np.int64).values / 1e19
# plt.plot(x, x_*5.807-x_[0]*5.807+df.iloc[76], linewidth=1, linestyle='dashed', color='black')
# ###########
# df.plot(color='k', ax=plt.gca(), zorder=1)
# plt.xlim(df.index[52], df.index[-1])
# plt.ylim(4.25,None)
# plt.ylabel("Real US GDP per capita (Log10)")
# plt.tight_layout()
# plt.savefig("Teaching/MacroModelling/AK_shock_persistence_chart.svg", transparent=True)
# plt.show()







