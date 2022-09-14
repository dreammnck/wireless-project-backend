import paho.mqtt.client as mqtt
import sys

host = "127.0.0.1"
port = 1883


def onMessage(client, userData, msg):
    print(msg.topic + ": " + msg.payload.decode())

client = mqtt.Client()
client.on_message = onMessage

if client.connect(host, port) != 0:
    print('Could not connect to MQTT broker')
    sys.exit(-1)

client.subscribe('test')

try:
    client.loop_forever()
except:
    print('Disconnect')