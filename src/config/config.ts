let environment = "dev";
// let environment = "production";

const config = {
    baseURL:
        environment === "production"
            ? process.env.NEXT_PUBLIC_APP_URL_PROD
            : process.env.NEXT_PUBLIC_APP_URL_LOCAL,
};

export default config;