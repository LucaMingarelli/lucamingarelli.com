"""  Created on 22/05/2024::
------------- nk_phase_space.py -------------

**Authors**: L. Mingarelli
"""
# Canonical New Keynesian Model
import numpy as np
import pylab as plt

θ = 2
i = 0.2
ρ, σ = 0.99, 0.9
g = 0.01
rn = ρ + g/σ

xlim = -0.4, 0
ylim = -1, -0.6

x = np.linspace(*xlim,200)
π1 = i-rn
π2 = θ**2/ρ *x

πm, xm = np.mgrid[ylim[0]:ylim[1]:200j, xlim[0]:xlim[1]:200j]

U = σ*(i - πm - rn)
V = ρ * πm - θ**2*xm
V[np.abs(V)==np.inf] = np.nan
U[np.abs(U)==np.inf] = np.nan

plt.figure(figsize=(5.5, 3.5))
plt.streamplot(xm, πm, U, V, color=(U**2+V**2)**(1/3),
               linewidth=(U**2+V**2)**(1/4)*1.2, # 0.5,
               cmap='viridis_r', broken_streamlines=False,
               density=0.6
               )
plt.plot(x, π2, color='k', linewidth=0.5)
plt.axhline(π1, color='k', linewidth=0.5)
plt.gca().annotate(r"$\dot{\pi}=0$", xy=(-0.15, -0.59), xytext=(-0.15, -0.59), annotation_clip=False)
plt.gca().annotate(r"$\dot{x}=0$", xy=(0.01, -0.805), xytext=(0.01, -0.805),annotation_clip=False)
# xlim = -0.012, x_max*1.025
plt.xlim(*xlim)
plt.ylim(*ylim)
plt.gca().spines[['right', 'top', 'left', 'bottom']].set_visible(False)
plt.xticks([])
plt.yticks([])
plt.gca().annotate("", xy=(-0.001, -1), xytext=(xlim[0], ylim[0]), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))
plt.gca().annotate("", xy=(-0.4, -0.6), xytext=(xlim[0], ylim[0]), arrowprops=dict(arrowstyle="-|>", lw=0.5, color='black'))
plt.gca().annotate(r"$\pi$", xy=(-0.41, -0.6), xytext=(-0.41, -0.6),annotation_clip=False)
plt.gca().annotate(r"$x$", xy=(0.005, -1.01), xytext=(.005, -1.01),annotation_clip=False)
plt.scatter(x=1, y=0, marker='o', color='black', zorder=5)
plt.scatter(x=0, y=0, marker='o', color='black', zorder=5)
plt.scatter(x=x[np.argmin(np.abs(π2-π1))],
            y=π1, marker='o', color='red', zorder=5)
plt.tight_layout()
plt.savefig("Teaching/MacroModelling/nk_phase_space.svg", transparent=True)
plt.show()





