const DefaultConfig = {
  service: {
    publicUrl: "https://meet.example.com/",
  },
  app: {
    port: 3000,
  },
};

export const Config = Object.assign(DefaultConfig, {
  service: {
    publicUrl: process.env.SERVICE__PUBLIC_URL,
  },
  app: {
    port: parseInt(process.env.PORT ?? "3000"),
  },
});
