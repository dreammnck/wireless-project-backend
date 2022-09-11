export default () => ({
  port: Number(process.env.PORT) || 8080,
  host: process.env.HOST,
});
