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
ALL_SENSOR = ['SENSOR1', 'SENSOR2', 'SENSOR3', 'SENSOR4', 'SENSOR5']

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


def producer(sensorId, mqtt_client):
    while True:
        mqtt_client.publish('saline', json.dumps({'sensorId': sensorId, 'sensorValue':  random.random() * (0.300 - 0.250 + 1) + 0.250, 'timestamp': str(datetime.now())}))
        time.sleep(1)
        

if __name__ == '__main__':
    mqtt_client = connect()
    threads = []
    
    for index in range(len(ALL_SENSOR)):
        x = threading.Thread(target=producer, args=(ALL_SENSOR[index],mqtt_client))
        threads.append(x)
        x.start()
        