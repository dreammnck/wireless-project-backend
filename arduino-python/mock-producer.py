import paho.mqtt.client as mqtt
from dotenv import load_dotenv
from datetime import datetime
import threading
import sys
import os
import json
import random
import time

load_dotenv()
ROOMS = ['0102', '0103', '0104', '0105', '0106']
INTERVAL = [120, 300, 600, 900, 1200]

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


def producer(room_id, mqtt_client, interval):
    index = 0
    while True:
        if index < interval:
            mqtt_client.publish('saline', json.dumps({'roomId': room_id, 'sensorValue': random.randrange(0,270)/1000, 'timestamp': str(datetime.now())}))
        else:
            mqtt_client.publish('saline', json.dumps({'roomId': room_id, 'sensorValue':  random.randrange(270, 500)/1000, 'timestamp': str(datetime.now())}))
        index += 1
        time.sleep(1)
        

if __name__ == '__main__':
    mqtt_client = connect()
    
    for index in range(len(ROOMS)):
        thread = threading.Thread(target=producer, args=(ROOMS[index],mqtt_client,INTERVAL[index]))
        thread.start()