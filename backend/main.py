from typing import Union
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erf
from sklearn.metrics import r2_score
# Set the seed for reproducibility
# np.random.seed(42)
def true_curve(x):
    # return ((0.4 * x**4) - (1.4 * x**3)) / ((0.68 * x**2) + 1)
    return erf(0.22 * x) + 0.17 * np.sin(5.5 * x)


# Create the original data
x = np.linspace(-5, 15, 200)
y_true = true_curve(x)
y_noisy=true_curve(x)
# Define noise ratios
noise_ratios = [0.05, 0.1, 0.15]


y_noisy += np.random.normal(0, 
                    0.1*np.sqrt(np.mean(np.square(y_noisy))),
                    size=len(y_noisy))


X = x.reshape(-1, 1) 
y = y_noisy.reshape(-1)      
from gplearn.genetic import SymbolicRegressor


est_gp = SymbolicRegressor(population_size=30,
                           generations=1, stopping_criteria=0.01,
                           p_crossover=0.4, p_subtree_mutation=0.2,
                           p_hoist_mutation=0.1, p_point_mutation=0.3,
                           max_samples=0.9, verbose=1,
                           parsimony_coefficient=0.001,function_set=('add','mul','sub','div','sin','cos','tan'))

#0.05,0.001,0.005,0.1,0.5
from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gen=1

class Item(BaseModel):
    user_fitness : list[float]

pop=[]
@app.get("/gen")
def get_items():
    est_gp.set_params(generations=gen, warm_start=True)
    population=est_gp.fit(X, y)
    global pop
    expr=[x.expression() for x in population]
    pop=[x for x in population]
    population=[x.execute(X) for x in population]
    population=(np.array(population).tolist())
    dataX=(np.array(X.reshape(-1)).tolist())
    dataY=(np.array(y).tolist())
    tc=(np.array(y_true).tolist())
    predicted = [x.execute(X) for x in pop]
    Rsquared = []
    for x in range(len(predicted)):
        Rsquared.append(r2_score(y,predicted[x]))
    lens=[x.getLength() for x in pop]
    simplicity = []
    for x in range(len(lens)):
        simplicity.append(round(-np.log(lens[x]) / np.log(5), 1))
    # print(f'simplicity:{simplicity}, rsquared:{Rsquared}')
    return {"gen":gen,"trueCurve":tc,"dataX":dataX,"dataY":dataY,"population":population,"expression":expr,"rsquared":Rsquared,'simplicity':simplicity}

    # arr = np.fromstring(population,dtype=float).reshape(2,200)
    # print(arr)


@app.post("/exec")
def exec(item:Item):
    global gen,pop
    est_gp.fitCalc(pop,item.user_fitness)
    gen+=1
    est_gp.set_params(generations=gen, warm_start=True)
    population=est_gp.fit(X, y)
    pop=[x for x in population]
    # for i in range(0,4):
    #     default_user_fitness=[0 for x in item.user_fitness]
    #     est_gp.fitCalc(pop,default_user_fitness)
    #     gen+=1
    #     est_gp.set_params(generations=gen, warm_start=True)
    #     population=est_gp.fit(X, y)
    #     pop=[x for x in population]

    expr=[x.expression() for x in population]
    population=[x.execute(X) for x in population]
    print(population)
    population=(np.array(population).tolist())
    dataX=(np.array(X.reshape(-1)).tolist())
    dataY=(np.array(y).tolist())
    tc=(np.array(y_true).tolist())

    predicted = [x.execute(X) for x in pop]
    Rsquared = []
    for x in range(len(predicted)):
        Rsquared.append(r2_score(y,predicted[x]))
    lens=[x.getLength() for x in pop]
    simplicity = []
    for x in range(len(lens)):
        simplicity.append(round(-np.log(lens[x]) / np.log(5), 1))

    return {"gen":gen,"trueCurve":tc,"dataX":dataX,"dataY":dataY,"population":population,"expression":expr,"rsquared":Rsquared,'simplicity':simplicity}
    
@app.get("/extrapolate")
def extrapolate():
    global gen,pop

    expr=[x.expression() for x in pop]
    X_test=np.linspace(-5,40,200)
    y_test=true_curve(X_test)
    X_test=X_test.reshape(-1,1)
    population=[x.execute(X_test) for x in pop]
    population=(np.array(population).tolist())
    dataX=(np.array(X_test.reshape(-1)).tolist())
    dataY=(np.array(y_test).tolist())
    tc=(np.array(y_test).tolist())
    

    predicted = [x.execute(X) for x in pop]
    Rsquared = []
    for x in range(len(predicted)):
        Rsquared.append(r2_score(y,predicted[x]))
    lens=[x.getLength() for x in pop]
    simplicity = []
    for x in range(len(lens)):
        simplicity.append(round(-np.log(lens[x]) / np.log(5), 1))

    return {"gen":gen,"trueCurve":tc,"dataX":dataX,"dataY":dataY,"population":population,"expression":expr,"rsquared":Rsquared,'simplicity':simplicity}

@app.get("/normalRange")
def normalRange():
    global gen,pop

    expr=[x.expression() for x in pop]
    X_test=np.linspace(-5,15,200)
    y_test=true_curve(X_test)
    X_test=X_test.reshape(-1,1)
    population=[x.execute(X_test) for x in pop]
    population=(np.array(population).tolist())
    dataX=(np.array(X_test.reshape(-1)).tolist())
    dataY=(np.array(y_test).tolist())
    tc=(np.array(y_test).tolist())
    

    predicted = [x.execute(X) for x in pop]
    Rsquared = []
    for x in range(len(predicted)):
        Rsquared.append(r2_score(y,predicted[x]))
    lens=[x.getLength() for x in pop]
    simplicity = []
    for x in range(len(lens)):
        simplicity.append(round(-np.log(lens[x]) / np.log(5), 1))

    return {"gen":gen,"trueCurve":tc,"dataX":dataX,"dataY":dataY,"population":population,"expression":expr,"rsquared":Rsquared,'simplicity':simplicity}




