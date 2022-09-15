from dotenv import load_dotenv
import paho.mqtt.client as mqtt
import pyfirmata
from datetime import datetime
import time
import sys
import os
import json

load_dotenv()
ROOM_ID='0101'

def init_board():
    board = pyfirmata.Arduino(os.getenv('FILE_PORT'))
    it = pyfirmata.util.Iterator(board)
    it.start()
    return board

def connect():
    mqtt_client = mqtt.Client()
    host = os.getenv('MQTT_HOST')
    port = os.getenv('MQTT_PORT')
    if mqtt_client.connect(str(host), int(port)) != 0:
        print('Could not connect to MQTT broker')
        sys.exit(-1)
    else:
        print('Successfully connected to mqtt broker')
    return mqtt_client

def loop(board, mqtt_client):

    sensor_input_pin =  board.get_pin('a:0:i')

    while True:
        analog_value = sensor_input_pin.read()
        print(analog_value)
        mqtt_client.publish('saline', json.dumps({'roomId': ROOM_ID, 'sensorValue': analog_value, 'timestamp': str(datetime.now())}))
        time.sleep(1)

if __name__ == '__main__':
    board = init_board()
    mqtt_client = connect()
    loop(board, mqtt_client)
