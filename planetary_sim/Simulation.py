# -------------------
# Runs the system simulation and communicates with the Unity concierge
# -------------------

import signal
from datetime import datetime
import socket
import json

from GravitySystem import GravitySystem
from body import Body
from vector import Vector
import system_serializer


class Simulation:
    def __init__(self, recvIds, myId):
        self.system = GravitySystem()
        self.syncing = False
        self.sock = None
        self.newPlanetParams = {}
        self.ids = recvIds
        self.id = myId

    def start(self):
        self.system.central_body = Body("Default Central Body", 10, 1)
        self.syncAndRun()

        try:
            self.syncAndRun()
        except Exception as e:
            print("Exception detected! Terminating the program...")
            print(e)
            self.shutdown(None, None)

    def addUnityClient(self, id):
        self.ids.append(id)

    # -------------------
    # Input handlers
    # -------------------

    @staticmethod
    def parseIntArray(strToParse):
        strToParse = strToParse.replace(
            "[", "").replace("]", "").replace(" ", "")
        intArr = list(map(int, strToParse.split(",")))
        return intArr

    def handleInput(self, input):
        if input == "No data":
            return

        try:
            dataDict = json.loads(input)
        except Exception as e:
            print("Invalid JSON:", input)
            return

        type = dataDict["Data_Type"]
        label = dataDict["Data_Label"]
        data = dataDict["Data"]

        if type == "String":
            if label == "Button":
                self.handleButtonInput(data)
                return

            elif label == "Keyboard":
                self.handleKeyboardInput(data)
                return

            elif label == "Message":
                if data == "Ready":
                    # Unity is ready to receive data
                    if self.system == None:
                        return

                    try:
                        updateStr = ""

                        central = {
                            "ID_Receiver": self.ids,
                            "ID_Sender": self.id,
                            "Data_Type": "JSONObject",
                            "Data_Label": "GameObject",
                            "Data": self.system.central_body.getJson()
                        }
                        centralJson = json.dumps(central)
                        updateStr += centralJson + "\n"

                        for b in self.system.orbiting_bodies:
                            body = {
                                "ID_Receiver": self.ids,
                                "ID_Sender": self.id,
                                "Data_Type": "JSONObject",
                                "Data_Label": "GameObject",
                                "Data": b.getJson()
                            }
                            bodyJson = json.dumps(body)
                            updateStr += bodyJson + "\n"

                        text = {
                            "ID_Receiver": self.ids,
                            "ID_Sender": self.id,
                            "Data_Type": "String",
                            "Data_Label": "Display Text",
                            "Data": self.system.statistics
                        }
                        textJson = json.dumps(text)
                        updateStr += textJson + "\n"

                        timestamp = {
                            "ID_Receiver": self.ids,
                            "ID_Sender": self.id,
                            "Data_Type": "String",
                            "Data_Label": "Timestamp",
                            "Data": str(datetime.now())
                        }
                        timestampJson = json.dumps(timestamp)
                        updateStr += timestampJson + "\n"

                        self.sock.send(updateStr.encode())
                        return

                    except socket.error as err:
                        print("No bytes were sent.")
                        print(err)
                        return
                        self.shutdown(0, 0)

        elif type == "JSONObject":
            if label == "Hand":
                hand = json.loads(data.replace("<", "{").replace(">", "}"))
                handBody = Body(hand["name"], self.system.hand_mass,
                                hand["scaleX"] / 2 * self.system.scale)
                handBody.setScale(self.system.scale)
                handBody.setLocation(
                    Vector(hand["posX"], hand["posY"], hand["posZ"]), True)
                handBody.setVelocity(
                    Vector(hand["velocityX"], hand["velocityY"], hand["velocityZ"]), True)
                self.system.update_body(handBody)
                return

        elif type == "IntArray":
            arr = Simulation.parseIntArray(data)

            if label == "NewSimulation":
                print("Unity requested simulation with ID", arr[0])

                successful = newClient(arr[1:], arr[0])
                if (successful == False):
                    # The simulation with this ID already existed.
                    recvId = []
                    recvId.append(dataDict["ID_Sender"])
                    failure = {
                        "ID_Receiver": recvId,
                        "ID_Sender": self.id,
                        "Data_Type": "String",
                        "Data_Label": "Message",
                        "Data": "Simulation already exists"
                    }
                    self.sock.sendall(json.dumps(failure).encode())
                return

            if label == "AddClients":
                for i in arr:
                    self.ids.append(i)
                    return

        print("Unhandled message:", input)

    def handleButtonInput(self, input):
        print("Received button input from Unity!")

        if input == "Speed Up":
            self.system.time_scale *= 2
        elif input == "Load":
            print("Unity wants to load a saved system. Loading system...")
            # if self.id == 4: self.loadSystem("C:\Users\ovras\Development\ERT.PlanetSimulator.Python\SavedSystems\SolarSystem.txt")
            # else: self.loadSystem("C:\Users\ovras\Development\ERT.PlanetSimulator.Python\SavedSystems\ExampleSystem.txt")
        elif input == "Add Planet":
            print(
                "Unity wants to add a planet to the system. Prompting user for more information...")
            keyboard = {
                "ID_Receiver": self.ids,
                "ID_Sender": self.id,
                "Data_Type": "JSONObject",
                "Data_Label": "GameObject",
                "Data": self.keyboardJson("Add planet with name").replace("{", "<").replace("}", ">")
            }
            self.sock.sendall(json.dumps(keyboard).encode())
        else:
            print("Unrecognized button message!", input)

    def handleKeyboardInput(self, input):
        print("Received keyboard input from Unity.")
        import time
        time.sleep(0.5)
        if input[1:11] == "Add planet":
            closingBraceIdx = input.index(">")
            param = input[17:closingBraceIdx]
            val = input[closingBraceIdx+1:]

            # Ask the user in Unity for the next piece of information about the new planet
            if param == "name":
                print("Received planet name.")
                self.newPlanetParams.update({param: val})
                keyboard = {
                    "ID_Receiver": self.ids,
                    "ID_Sender": self.id,
                    "Data_Type": "JSONObject",
                    "Data_Label": "GameObject",
                    "Data": self.keyboardJson("Add planet with mass").replace("{", "<").replace("}", ">")
                }
                self.sock.sendall(json.dumps(keyboard).encode())

            elif param == "mass":
                print("Received planet mass.")
                try:
                    self.newPlanetParams.update({param: float(val)})
                except ValueError:
                    print("Planet mass must be a number!")
                    keyboard = {
                        "ID_Receiver": self.ids,
                        "ID_Sender": self.id,
                        "Data_Type": "JSONObject",
                        "Data_Label": "GameObject",
                        "Data": self.keyboardJson("Add planet with mass").replace("{", "<").replace("}", ">")
                    }
                    self.sock.sendall(json.dumps(keyboard).encode())

                keyboard = {
                    "ID_Receiver": self.ids,
                    "ID_Sender": self.id,
                    "Data_Type": "JSONObject",
                    "Data_Label": "GameObject",
                    "Data": self.keyboardJson("Add planet with radius").replace("{", "<").replace("}", ">")
                }
                self.sock.sendall(json.dumps(keyboard).encode())
            elif param == "radius":
                print("Received planet radius.")
                try:
                    self.newPlanetParams.update({param: float(val)})
                except ValueError:
                    print("Planet radius must be a number!")
                    keyboard = {
                        "ID_Receiver": self.ids,
                        "ID_Sender": self.id,
                        "Data_Type": "JSONObject",
                        "Data_Label": "GameObject",
                        "Data": self.keyboardJson("Add planet with radius").replace("{", "<").replace("}", ">")
                    }
                    self.sock.sendall(json.dumps(keyboard).encode())

                keyboard = {
                    "ID_Receiver": self.ids,
                    "ID_Sender": self.id,
                    "Data_Type": "JSONObject",
                    "Data_Label": "GameObject",
                    "Data": self.keyboardJson("Add planet with speed").replace("{", "<").replace("}", ">")
                }
                self.sock.sendall(json.dumps(keyboard).encode())
            elif param == "speed":
                print("Received planet speed.")
                try:
                    self.newPlanetParams.update({param: float(val)})
                except ValueError:
                    print("Planet speed must be a number!")
                    keyboard = {
                        "ID_Receiver": self.ids,
                        "ID_Sender": self.id,
                        "Data_Type": "JSONObject",
                        "Data_Label": "GameObject",
                        "Data": self.keyboardJson("Add planet with speed").replace("{", "<").replace("}", ">")
                    }
                    self.sock.sendall(json.dumps(keyboard).encode())

                keyboard = {
                    "ID_Receiver": self.ids,
                    "ID_Sender": self.id,
                    "Data_Type": "JSONObject",
                    "Data_Label": "GameObject",
                    "Data": self.keyboardJson("Add planet with orbit radius").replace("{", "<").replace("}", ">")
                }
                self.sock.sendall(json.dumps(keyboard).encode())
            elif param == "orbit radius":
                # We have all of the necessary information to make a new body
                print("Received planet orbit radius.")
                try:
                    self.newPlanetParams.update({param: float(val)})
                except ValueError:
                    print("Planet orbit radius must be a number!")
                    keyboard = {
                        "ID_Receiver": self.ids,
                        "ID_Sender": self.id,
                        "Data_Type": "JSONObject",
                        "Data_Label": "GameObject",
                        "Data": self.keyboardJson("Add planet with orbit radius").replace("{", "<").replace("}", ">")
                    }
                    self.sock.sendall(json.dumps(keyboard).encode())

                print("Creating a new planet...")
                newBody = Body(
                    self.newPlanetParams["name"], self.newPlanetParams["mass"], self.newPlanetParams["radius"])
                newBody.setLocation(Vector(1, 0, 0), False)
                newBody.orbitDirection = Vector(0, 0, 1)
                newBody.setSpeed(self.newPlanetParams["speed"])
                newBody.setOrbitRadius(self.newPlanetParams["orbit radius"])

                self.system.add_body(newBody)
                self.newPlanetParams: dict[str] = {}
            else:
                print("Unrecognized parameter when adding a planet:", param)
        elif input[1:8] == "Console":
            self.handleConsoleInput(input[9:])
        elif input[1:12] == "Edit planet":
            pass

    def handleConsoleInput(self, input):
        input = input.lower()
        print("Received console-style input from Unity:", input)

        # Creating a new body
        if input[:3] == "new":
            try:
                input = input[input.index("(") + 1:]
                name = input[:input.index(",")].strip()
                input = input[input.index(",") + 1:]
                mass = float(input[:input.index(",")].strip())
                input = input[input.index(",") + 1:]
                rad = float(input[:input.index(",")].strip())
                input = input[input.index(",") + 1:]
                speed = float(input[:input.index(",")].strip())
                input = input[input.index(",") + 1:]
                orbitRad = float(input[:input.index(")")].strip())
            except ValueError:
                print("Error: Incorrect format for adding a new planet!")
                return

            b = Body(name, mass, rad)
            b.setSpeed(speed)
            b.setOrbitRadius(orbitRad)
            self.system.add_body(b)

        # Need to edit an existing body
        else:
            bodyName = input[:input.index(".")].strip()
            fieldToEdit = input[input.index(".")+1:input.index("=")].strip()
            newValue = input[input.index("=")+1:].strip()

            body = self.system.get_body_with_name(bodyName)
            if body == False:
                print("Error: Body with name",
                      bodyName, "is not in the system.")

            if fieldToEdit == "name":
                body.name = newValue
            else:
                try:
                    floatVal = float(newValue)
                except ValueError:
                    print(
                        "Error: Cannot change a numerical field to a non-numerical value.", newValue)
                    return

                if fieldToEdit == "mass":
                    body.mass = floatVal
                elif fieldToEdit == "radius":
                    body.setBodyRadius(floatVal)
                elif fieldToEdit == "speed":
                    body.setSpeed(floatVal)
                elif fieldToEdit == "orbitradius":
                    body.setOrbitRadius(floatVal)
                else:
                    print("Error: Unrecognized field to edit:", fieldToEdit)

    # -------------------
    # JSON
    # -------------------

    def keyboardJson(self, label):
        data = {
            "type": "keyboard",
            "name": label,
            "posX": 0,
            "posY": 0.5,
            "posZ": 0,
            "rotX": 0,
            "rotY": 0,
            "rotZ": 0,
            "scaleX": 0.1,
            "scaleY": 0.1,
            "scaleZ": 0.1
        }
        jsonString = json.dumps(data)

        return jsonString

    # -------------------
    # Saving and loading
    # -------------------

    def loadSystem(self, filename):
        print("Loading a saved system...")
        dCentral = {
            "ID_Receiver": self.ids,
            "ID_Sender": self.id,
            "Data_Type": "JSONObject",
            "Data_Label": "Destroy",
            "Data": self.system.central_body.getJson()}
        self.sock.sendall(json.dumps(dCentral).encode())

        for b in self.system.orbiting_bodies:
            dBody = {
                "ID_Receiver": self.ids,
                "ID_Sender": self.id,
                "Data_Type": "JSONObject",
                "Data_Label": "Destroy",
                "Data": b.getJson()
            }
            self.sock.sendall(json.dumps(dCentral).encode())

        with open(filename) as jsonFile:
            jsonArray = json.load(jsonFile)
            self.system = system_serializer.object_to_system(jsonArray)

    def saveSystem(self, filename, sys):
        with open(filename, 'w') as outFile:
            jsonArray = system_serializer.system_to_object(sys)
            json.dump(jsonArray, outFile)

    # -------------------
    # Socket communication
    # -------------------

    def processSocketData(self):
        data = ""
        counter = 0

        while data != "No data":
            counter += 1
            data = self.readToNewline()
            self.handleInput(data)

    def readToNewline(self):
        s = ""
        try:
            while True:
                data = self.sock.recv(1)
                if (data == "\n"):
                    break
                s += data
        except Exception as e:
            if (str(e))[:13] == "[Errno 10054]":
                # Socket has been closed by the server
                print("Server has closed the socket. Shutting down...")
                import _thread
                _thread.interrupt_main()
                self.shutdown(0, 0)
            return "No data"

        return s

    def syncAndRun(self):
        print("Starting the simulation and server...")
        print("Simulation ID is", self.id)
        self.syncing = True
        prev = datetime.now()

        host = '127.0.0.1'
        port = 64209
        backlog = 5

        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        print("Connecting to port", port, "...")
        self.sock.connect((host, port))
        self.sock.setblocking(False)

        messageid = 0

        # Send the handshake message
        self.sock.send(("PYTHON " + str(self.id)).encode())
        import time
        time.sleep(.5)

        print("Handshake")

        while self.syncing:
            curr = datetime.now()
            dt = (curr - prev).total_seconds()
            prev = curr

            if self.system != None:
                toRemove = self.system.tick_system(dt)

                for b in toRemove:
                    destroyMessage = {
                        "ID_Receiver": self.ids,
                        "ID_Sender": self.id,
                        "Data_Type": "JSONObject",
                        "Data_Label": "Destroy",
                        "Data": b.getJson()
                    }
                    self.sock.sendall(json.dumps(destroyMessage).encode())
                    print("Body", b.name, "from simulation", self.id,
                          "removed from system because it exceeded the system boundary.")

            self.processSocketData()

    def shutdown(self, signal, frame):
        if self.sock != None:
            self.sock.close()
        print("Socket closed.")
        exit(0)


# -------------------
# Uses multithreading to handle running multiple simulations concurrently
# -------------------


simIds = []


def startNewSimulation(recvIds, myId):
    sim = Simulation(recvIds, myId)
    sim.start()


def newClient(recvIds, myId):
    if myId in simIds:
        # This simulation already exists!
        return False

    simIds.append(myId)
    import threading
    thread = threading.Thread(target=startNewSimulation, args=(recvIds, myId))
    thread.daemon = True
    thread.start()
    return True


def stop(signal, frame):
    exit(0)

# signal.signal(signal.SIGINT, stop)


unityIds = []
unityIds.append(0)
newClient(unityIds, 0)

# Keep the main thread alive to allow daemon threads to run
try:
    while True:
        pass
except Exception as e:
    print("Shutting down main thread...")
