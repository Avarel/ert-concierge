# # -------------------
# # A template file for running and syncing a simulation through the Unity
# # concierge
# # -------------------

# import socket
# import select
# import json
# import sys

# class Simulation:
#     def __init__(self, recvIds, myId):
#         # Tells the simulation whether it is ready to send and receive data
#         self.syncing = False
#         # Socket to send/receive on
#         self.sock = None
#         # IDs of the clients connected to this simulation
#         # Tells Unity concierge who to send the data to
#         self.ids = recvIds
#         # ID of the simulation
#         self.id = myId

#         # -------------------
#         # Any other necessary initialization, for example initializing a class
#         # that controls your simulation

#     def start(self):
#         """
#         Used to start the simulation from outside the Simulation class
#         Useful if multithreading is needed to handle multiple simulations,
#         otherwise this can be handled in __init__
#         """
#         try:
#             self.syncAndRun()
#         except Exception as e:
#             print("Exception detected! Terminating the program...")
#             print(e)
#             self.shutdown(None, None)

#     # -------------------
#     # Input handlers
#     # -------------------

#     @staticmethod
#     def parseIntArray(strToParse):
#         strToParse = strToParse.replace("[", "").replace("]", "").replace(" ", "")
#         intArr = map(int, strToParse.split(","))
#         return intArr

#     def handleInput(self, input):
#         """
#         Handles different commands sent from Unity by the concierge

#         Once unpacked from JSON, data comes in the following format:
#         {
#         "ID_Receiver" : (int array),
#         "ID_Sender" : (int),
#         "Data_Type" : (string),
#         "Data_Label" : (string),
#         "Data" : (string)
#         }
#         """
#         if input == "No data":
#             return

#         try:
#             dataDict = json.loads(input)
#         except Exception as e:
#             print("Invalid JSON:", input)
#             return

#         type = dataDict["Data_Type"]
#         label = dataDict["Data_Label"]
#         data = dataDict["Data"]

#         # -------------------
#         # Handle different types of messages here
#         # Basic message types are provided

#         if type == "String":
#             if label == "Button":
#                 self.handleButtonInput(data)
#                 return

#             elif label == "Keyboard":
#                 self.handleKeyboardInput(data)
#                 return

#             elif label == "Message":
#                 if data == "Ready":
#                     # Unity is ready to receive data
#                     if self.system == None: return

#                     try:
#                         # -------------------
#                         # Send any position updates or other relevant information
#                         # to Unity

#                         updateStr = ""

#                         exampleMessage = {
#                         "ID_Receiver" : self.ids,
#                         "ID_Sender" : self.id,
#                         "Data_Type" : "String",
#                         "Data_Label" : "Example",
#                         "Data" : "Hello!"
#                         }
#                         exampleJson = json.dumps(exampleMessage)
#                         updateStr += exampleJson

#                         object = {
#                             "ID_Receiver" : self.ids,
#                             "ID_Sender" : self.id,
#                             "Data_Type" : "JSONObject",
#                             "Data_Label" : "GameObject",
#                             "Data" : self.gameObjectJson()
#                         }
#                         objectJson = json.dumps(object)
#                         updateStr += objectJson

#                         self.sock.sendall(updateStr.encode())
#                         return

#                     except socket.error as err:
#                         print("No bytes were sent.")
#                         print(err)
#                         return
#                         self.shutdown(0, 0)

#         elif type == "IntArray":
#             # Helpful if multithreading is used to control multiple simulations

#             arr = Simulation.parseIntArray(data)

#             if label == "NewSimulation":
#                 print "Unity requested simulation with ID", arr[0]

#                 successful = newClient(arr[1:], arr[0])
#                 if (successful == False):
#                     # The simulation with this ID already existed.
#                     recvId = []
#                     recvId.append(dataDict["ID_Sender"])

#                     # Tell Unity that the simulation already exists so that it
#                     # can instead request that a new client be added
#                     failure = {
#                         "ID_Receiver": recvId,
#                         "ID_Sender": self.id,
#                         "Data_Type": "String",
#                         "Data_Label": "Message",
#                         "Data": "Simulation already exists"
#                     }
#                     self.sock.sendall(json.dumps(failure) + "\n")
#                 return

#             if label == "AddClients":
#                 """
#                 If a new student enters the classroom or alcove and needs to view this
#                 simulation, this message can be sent
#                 """
#                 for i in arr:
#                     self.ids.append(i)
#                     return

#         print "Unhandled message:", input

#     def handleButtonInput(self, input):
#         """
#         The input parameter is the name of the button object in Unity
#         Handles any button messages
#         """
#         if input == "Example":
#             print "Example button pressed!"
#         else:
#             print "Unrecognized button message!", input

#     def handleKeyboardInput(self, input):
#         """
#         Keyboard input comes in the format:
#         <Keyboard name>Keyboard text on submit
#         """
#         # Sleeping the thread gives Unity time to destroy the keyboard if needed
#         import time
#         time.sleep(0.5)

#         # Handle any types of keyboard inputs here, for example a console style
#         # keyboard
#         if input[1:13] == "New keyboard":
#             keyboard = {
#                 "ID_Receiver" : self.ids,
#                 "ID_Sender" : self.id,
#                 "Data_Type" : "JSONObject",
#                 "Data_Label" : "GameObject",
#                 "Data" : self.keyboardJson("New keyboard")
#             }
#             self.sock.sendall(json.dumps(keyboard) + "\n")
#         elif input[1:8] == "Console":
#             self.handleConsoleInput(input[9:])
#         else:
#             print "Unrecognized keyboard message!", input

#     def handleConsoleInput(self, input):
#         input = input.lower()

#         # -------------------
#         # If it is desired to expose Python-style console inputs or other types
#         # of console inputs in the Unity simulation, they can be handled here
#         pass

#     # -------------------
#     # JSON
#     # -------------------

#     def keyboardJson(self, label):
#         """
#         Generates a JSON object for Unity to create a keyboard with a given name
#         """
#         data = {
#             "type" : "keyboard",
#             "name" : label,
#             "posX" : 0,
#             "posY" : 0.5,
#             "posZ" : 0,
#             "rotX" : 0,
#             "rotY" : 0,
#             "rotZ" : 0,
#             "scaleX" : 0.1,
#             "scaleY" : 0.1,
#             "scaleZ" : 0.1
#         }
#         jsonString = json.dumps(data)

#         # Replace brackets so that the serializer doesn't get confused
#         # They are replaced again once Unity receives the message
#         return jsonString.replace("{", "<").replace("}", ">")

#     def gameObjectJson(self):
#         """
#         Generates an example GameObject json string
#         Possible types include sphere, cylinder, cube, capsule, keyboard, button
#         More can be added on the Unity side if needed
#         """
#         data = {
#             "type" : "sphere",
#             "name" : "example sphere",
#             "posX" : 0,
#             "posY" : 0,
#             "posZ" : 0,
#             "rotX" : 0,
#             "rotY" : 0,
#             "rotZ" : 0,
#             "scaleX" : 1,
#             "scaleY" : 1,
#             "scaleZ" : 1
#         }
#         jsonString = json.dumps(data)

#         # Replace brackets so that the serializer doesn't get confused
#         # They are replaced again once Unity receives the message
#         return jsonString.replace("{", "<").replace("}", ">")

#     # -------------------
#     # Socket communication
#     # -------------------

#     def processSocketData(self):
#         """
#         Reads each available line of data from the socket and handles them
#         individually
#         """
#         data = ""
#         counter = 0

#         while data != "No data":
#             counter += 1
#             data = self.readToNewline()
#             self.handleInput(data)

#     def readToNewline(self):
#         """
#         Reads from the socket until it reaches a new line character
#         """
#         str = ""
#         try:
#             while True:
#                 data = self.sock.recv(1)
#                 if (data == "\n"): break
#                 str += data
#         except Exception as e:
#             return "No data"

#         return str

#     def syncAndRun(self):
#         print "Starting the simulation and server..."
#         print "Simulation ID is", self.id
#         self.syncing = True

#         # Whichever IP address is hosting the server and on which port to connect
#         host = '131.215.144.245'
#         port = 60000

#         self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#         print "Connecting to port", port, "..."
#         self.sock.connect((host, port))
#         self.sock.setblocking(False)

#         print "Connection successful!"

#         # Send the handshake message
#         self.sock.sendall("PYTHON " + str(self.id) + "\n")
#         import time
#         time.sleep(.5)

#         while self.syncing:
#             # Also handle any updates to your simulation here
#             self.processSocketData()

#     def shutdown(self, signal, frame):
#         if self.sock != None: self.sock.close(); print "Socket closed."
#         exit(0)


# # -------------------
# # Uses multithreading to handle running multiple simulations concurrently
# # -------------------

# #from Simulation import Simulation

# import threading
# import signal

# simIds = []

# def startNewSimulation(recvIds, myId):
#     # Create a new instance of your simulation class if needed, or just do any
#     # set up that is needed
#     pass

# def newClient(recvIds, myId):
#     if myId in simIds:
#         # This simulation already exists!
#         return False

#     # Create a new thread to run a new simulation as a different Python client
#     simIds.append(myId)
#     thread = threading.Thread(target=startNewSimulation, args=(recvIds,myId))
#     thread.daemon = True
#     thread.start()
#     return True

# signal.signal(signal.SIGINT, Simulation.shutdown)

# # Create an initial client to do the first connection to the server and receive
# # messages to create any requested clients
# unityIds = []
# unityIds.append(0)
# newClient(unityIds, 0)

# # Keep the main thread alive to allow daemon threads to run
# try:
#     while True: pass
# except Exception as e:
#     # Only exception that should be caught here is a keyboard interrupt used to
#     # stop the program
#     print "Shutting down main thread..."
