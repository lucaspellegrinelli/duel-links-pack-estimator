# Duel Links Pack Estimator

This can be accessed in https://lucaspellegrinelli.github.io/duel-links-packs/

## What it is?

Well, in Yu-Gi-Oh Duel Links you can get cards from boxes of cards. The webpage is designed to simulate box openings with a optmized strategy to estimate how many packs you'd need to open to acquire specific cards to build a new deck for example. The page gives the user to possibility to specify how many of each of Super Rare (SR) / Ultra Rare (UR) cards they are seeking in up to four different boxes.

## Isn't this slow running on browser since it's a simulation?

Yes. But since I'm using WebWorkers, the user experience with the UI is not compromised and browser freezes are not expected. The number of simulated packs are also not that high, so an output from the simulation is expected in about 0.5 seconds on desktop and 1 second on mobile.
