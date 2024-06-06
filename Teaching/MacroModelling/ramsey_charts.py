"""  Created on 05/06/2024::
------------- ramsey_charts.py -------------

**Authors**: L. Mingarelli
"""
# Ramsey
import numpy as np
import pylab as plt

A = 1
α = 0.5
# n = 1
# δ = 1
# σ = 1
# ρ = 1.8
n, δ, ρ, σ = 1, 0, 0.8, 1
k = np.linspace(0,1,200)

f = lambda x: A * x**α
f_ = lambda x: α * A * x**(α-1)
c = f(k) - (n+δ)*k

k_max = k[np.abs(c)[1:].argmin()+1] * 1.1
c_max = c.max() * 1.1


xlim = -0.05, k_max
ylim = -0.05, c_max*1.2

Cm, Km = np.mgrid[ylim[0]:ylim[1]:200j, xlim[0]:xlim[1]:200j]
Cm, Km = Cm[30:,:], Km[30:,:]
U = f(Km) - (n+δ)*Km - Cm
V = σ * (f_(Km)-δ-ρ) * Cm
V[np.abs(V)==np.inf] = np.nan
U[np.abs(U)==np.inf] = np.nan

from scipy.integrate import solve_ivp

def f_sys(t, y):
    k, c = y
    return [f(k)-n*k -c,
            σ*(f_(k)-ρ)*c
            ]
ϵ = 1e-6
kss = (ρ/(α*A))**(1/(α-1))
css = f(kss) - n*kss
T = 50
t_eval = np.linspace(0,T, 800)[::-1]
ksp_u, csp_u = solve_ivp(fun=f_sys, t_span=[T, 0], y0=[kss+ϵ, css+ϵ], method='DOP853', t_eval=t_eval).y
ksp_l, csp_l = solve_ivp(fun=f_sys, t_span=[T, 0], y0=[kss-ϵ, css-ϵ], method='DOP853', t_eval=t_eval).y



plt.figure(figsize=(5.5, 3.5))
plt.streamplot(Km, Cm, U, V, color=(np.abs(U)+np.abs(V))**0.0001,
               linewidth=(U**2+V**2)**(1/2)*4, # 0.5,
               cmap='viridis_r', broken_streamlines=False,
               density=0.5
               )
plt.plot(k, c, color='k')
k_star = (A/(δ+ρ))**2/4
plt.axvline(k_star, color='k', linewidth=1, ymin=0.155)


plt.plot(ksp_u, csp_u, linewidth=0.5, color='red', alpha=0.75)
plt.plot(ksp_l, csp_l, linewidth=0.5, color='red', alpha=0.75)
plt.scatter(x=k_star, y=f(k_star) - (n+δ)*k_star, marker='o', color='red', zorder=5)
for i,(x,y) in enumerate(zip(ksp_l[-100::15], csp_l[-100::15])):
    dx, dy = ksp_l[i+1]-ksp_l[i], csp_l[i+1]-csp_l[i]
    if dx<0: dx *= -1
    if dy<0: dy *= -1
    if abs(x-kss*1.1)>0.1:
        plt.gca().annotate("",
                           xy=(x+dx, y+dy*2.3),
                           xytext=(x,y),
                           arrowprops=dict(arrowstyle="->",
                                           color='red', alpha=0.75))
for i,(x,y) in enumerate(zip(ksp_u[::10], csp_u[::10])):
    dx, dy = ksp_u[i+1]-ksp_u[i], csp_u[i+1]-csp_u[i]
    if dx>0: dx *= -1
    if dy>0: dy *= -1
    if abs(x-kss*1.1)>0.05:
        plt.gca().annotate("",
                           xy=(x+dx, y+dy),
                           xytext=(x,y),
                           arrowprops=dict(arrowstyle="->",
                                           color='red', alpha=0.75))
# plt.xlim(*xlim)
# plt.ylim(*ylim)
# plt.show()

plt.gca().annotate(r"$\dot{c}=0$", xy=(0.345, 0.335), xytext=(0.345, 0.335),annotation_clip=False)
plt.gca().annotate(r"$\dot{k}=0$", xy=(0.7, 0.15), xytext=(0.7, 0.15),annotation_clip=False)
xlim = -0.012, k_max*1.025
plt.xlim(*xlim)
plt.ylim(*ylim)
plt.gca().spines[['right', 'top', 'left', 'bottom']].set_visible(False)
plt.xticks([])
plt.yticks([])
plt.gca().annotate("", xy=(xlim[1], 0), xytext=(-0.001, 0), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))
plt.gca().annotate("", xy=(0, ylim[1]), xytext=(0, -0.002), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))
plt.gca().annotate(r"$c$", xy=(-0.035, 0.27), xytext=(-0.035, 0.27),annotation_clip=False)
plt.gca().annotate(r"$k$", xy=(1.115, -0.015), xytext=(1.115, -0.015),annotation_clip=False)
plt.scatter(x=1, y=0, marker='o', color='black', zorder=5)
plt.scatter(x=0, y=0, marker='o', color='black', zorder=5)
plt.scatter(x=k_star, y=f(k_star) - (n+δ)*k_star, marker='o', color='red', zorder=5)
plt.tight_layout()
plt.savefig("Teaching/MacroModelling/ramsey_chart.svg", transparent=True)
plt.show()





