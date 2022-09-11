export default () => ({
  port: Number(process.env.PORT) || 8080,
  host: process.env.HOST,
  mqtt: {
    url: process.env.MQTT_URL,
  },
});
