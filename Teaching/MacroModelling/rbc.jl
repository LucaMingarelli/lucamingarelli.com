using MacroModelling
import StatsPlots

@model RBC begin
    r[0] = α * A[0] * k[0]^(α-1) * ℓ[0]^(1-α) - δ # Real Rate of Interest: Marginal Product of Capital minus Capital Depreciation 
    w[0] = (1-α) * y[0]                             # Wage: Marginal Product of Labour
    c[1] / c[0] = β * (1+r[1])                      # Euler Equation for Consumption
    k[0] = (1 - r[-1]) * k[-1] + ℓ[-1]*w[-1] - c[-1] # EoM
    # ℓ[1] = 1- β *(1+r[1]) * w[0] / w[1] * (1-ℓ[0])
    ℓ[0] = 1-η/(1-η) * c[0] / w[0]                  # Labout Supply
    y[0] = A[0] * k[0]^α * ℓ[0]^(1-α)           # Production Function
    log(A[0]) = ϕ * log(A[-1]) + σᶻ * ε[x]     # AR(1)
    # -----------------------------------------
    c[0] =  (1-s[0]) * y[0]                    # Saving rate
    
end

@parameters RBC begin
    σᶻ= 0.00763
    ϕ = 0.9
    δ = 0.025
    α = 0.36
    β = 0.99
    η = 0.497
end
plot_irf(RBC, periods=150, 
         save_plots=true,
         save_plots_format=:svg)



plot_irf(RBC, shocks=:simulate, periods=200,
         save_plots=true,
         save_plots_format=:svg)



plot_irf(RBC, periods=150, algorithm=:pruned_third_order)
plot_irf(RBC, periods=150,
         variables=[:A, :k,:c, :z, :w])

plot_simulations(RBC, algorithm=:pruned_third_order)

get_correlation(RBC)
get_autocorrelation(RBC)

get_solution(RBC)
get_steady_state(RBC)

plot_solution(RBC, :k)
plot_solution(RBC, :k, algorithm=:second_order)
plot_solution(RBC, :k, algorithm=:pruned_third_order)
         
         