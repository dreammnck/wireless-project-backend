export default () => ({
  port: Number(process.env.PORT) || 8080,
  host: process.env.HOST,
  origin_host: process.env.ORIGIN_HOST,
  mqtt: {
    url: process.env.MQTT_URL,
  },
  jwt: {
    secret: process.env.SECRET,
    expireIn: process.env.EXPIRE_IN,
  },
});
