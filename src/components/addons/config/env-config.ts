interface IEnvConfig {
  NEXT_APP_NAME: string;
}

export const envConfig: IEnvConfig = {
  NEXT_APP_NAME: process.env.NEXT_APP_NAME || "Next App",
};
