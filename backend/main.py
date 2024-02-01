from typing import Union
import numpy as np
import matplotlib.pyplot as plt
from sklearn.utils import check_random_state

# Set the seed for reproducibility
np.random.seed(42)
rng = check_random_state(0)
# Generate synthetic data with a combination of sine and cosine functions
X = np.random.uniform(low=-5, high=5, size=100)
Y = np.random.uniform(low=-5, high=5, size=100)
true_curve = 0.4 * X * Y - 1.5 * X + 2.5 * Y + 1

y = true_curve + np.random.normal(0, 5, 100)  # Synthetic data with noise
# print(X,Y)
X_train=np.column_stack((X,Y))
# print(X_train)
# Reshape X and y to match the expected format
# X = X.reshape(-1, 1)  # Reshape X to [n_samples, n_features] where n_features is 1
y = y.reshape(-1)     # Reshape y to [n_samples]
from gplearn.genetic import SymbolicRegressor
est_gp = SymbolicRegressor(population_size=1,
                           generations=1, stopping_criteria=0.01,
                           p_crossover=0.7, p_subtree_mutation=0.1,
                           p_hoist_mutation=0.05, p_point_mutation=0.1,
                           max_samples=0.9, verbose=1,
                           parsimony_coefficient=0.01, random_state=0,function_set=("add","sub","mul","div","sin","inv","cos"))

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
    population=est_gp.fit(X_train, y)
    global pop
    expr=[x.expression() for x in population]
    pop=[x for x in population]

    population=[x.execute(X_train) for x in population]

    population=(np.array(population).tolist())
    dataX = np.vstack((X, Y)).tolist()
    dataY=(np.array(y).tolist())

    tc=(np.array(true_curve).tolist())
    print(X)
    return {"trueCurve":tc,"dataX":dataX,"dataY":dataY,"population":population,"expression":expr}
    # arr = np.fromstring(population,dtype=float).reshape(2,200)
    # print(arr)


@app.post("/exec")
def exec(item:Item):
    print(item.user_fitness)
    global gen,pop
    est_gp.fitCalc(pop,item.user_fitness)
    gen+=1
    est_gp.set_params(generations=gen, warm_start=True)
    population=est_gp.fit(X_train, y)
    expr=[x.expression() for x in population]
    pop=[x for x in population]
    population=[x.execute(X_train) for x in population]
    population=(np.array(population).tolist())
    dataX = np.vstack((X, Y)).tolist()
    dataY=(np.array(y).tolist())
    tc=(np.array(true_curve).tolist())

    return {"trueCurve":tc,"dataX":dataX,"dataY":dataY,"population":population,"expression":expr}
    