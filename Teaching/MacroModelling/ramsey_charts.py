# Ramsey
import numpy as np
import pylab as plt

A = 1
α = 0.5
# n = 1
# δ = 1
# σ = 1
# ρ = 1.8
n, δ, ρ, σ = 1, 0, 1.2, 1
k = np.linspace(0,1,200)

f = lambda x: A * x**α
f_ = lambda x: α * A * x**(α-1)
c = f(k) - (n+δ)*k

k_max = k[np.abs(c)[1:].argmin()+1] * 1.1
c_max = c.max() * 1.1


xlim = -0.01, k_max
ylim = -0.01, c_max

Cm, Km = np.mgrid[ylim[0]:ylim[1]:100j, xlim[0]:xlim[1]:100j]
U = f(Km) - (n+δ)*Km - Cm
V = σ * (f_(Km)-δ-ρ) * Cm
V[np.abs(V)==np.inf] = np.nan
U[np.abs(U)==np.inf] = np.nan

plt.figure(figsize=(5.5, 3.5))
plt.streamplot(Km, Cm, U, V, color=(np.abs(U)+np.abs(V))**0.0001, linewidth=0.5,
               cmap='viridis_r', broken_streamlines=False,
               density=1
               )
plt.plot(k, c, color='k')
k_star = (A/(δ+ρ))**2/4
plt.axvline(k_star, color='k', linewidth=1, ymin=0.04)
plt.gca().annotate(r"$\dot{c}=0$", xy=(0.135, 0.28), xytext=(0.135, 0.28),annotation_clip=False)
plt.gca().annotate(r"$\dot{k}=0$", xy=(0.7, 0.15), xytext=(0.7, 0.15),annotation_clip=False)
xlim = 0, k_max*1.025
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
plt.scatter(x=k_star, y=f(k_star) - (n+δ)*k_star, marker='o', color='green', zorder=5)
plt.tight_layout()
plt.savefig("Teaching/MacroModelling/ramsey_chart.svg", transparent=True)
plt.show()





