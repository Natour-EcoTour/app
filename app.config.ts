import { ExpoConfig, ConfigContext } from 'expo/config';

const EAS_PROJECT_ID = "4874ed03-7bf0-400f-84ae-e948d17e3a08"
const PROJECT_SLUG = "natour_app"
const OWNER = "flamingo_lindo"

export default ({ config }: { config: ExpoConfig }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...(config.android?.config ?? {}),
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY ?? "",
      },
    },
  },
});
