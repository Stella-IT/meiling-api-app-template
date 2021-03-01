export interface Config {
  meiling: {
    hostname: string;
  };
  fastify: {
    listen: number | string;
    proxy?: {
      allowedHosts?: string[];
    };
  };
  permissions: {
    required: string[];
  };
}
