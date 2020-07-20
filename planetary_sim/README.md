# ERT / Planet Simulation
Simulates the motion of bodies orbiting around a central body. This was adapted from @alisonnoyes [planet simulator](https://github.com/alisonnoyes/ERT.PlanetSimulator).

The Python simulator computes the positions of the bodies affected by gravity and collisions and sends them to the concierge. It accounts for locations of the player in VR and for any button inputs which it receives from the concierge.

The planet simulator allows scaling of distances, sizes, and time in order to allow real life examples such as the solar system to be simulated in an easily visible way. These are all set during runtime as well as editable values for the planets' sizes, masses, orbit radii, etc.

Users can either input values for planets they want to add, throw in a selection of planets, or load a saved preset of our solar system. User systems can also be saved in JSON format to be loaded in the future.

The program computes and displays helpful values such as the period of orbit, perihelion, aphelion, and more.

## Running the Concierge Bot
```bash
python3 concierge_bot.py
```