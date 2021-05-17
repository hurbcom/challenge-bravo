import requests


class ApiSystemService:
    def __init__(self, config, system, time_out):
        self.config = config
        self.system = system

    def __get_response(self, platform, url):
        return requests.get(
            url=url,
            verify=self.config[platform]["verify"],
            headers=self.config[platform]["headers"]
        )

    def __create_url_web_api(self, platform, web_id, params, system):
        """
        Method that creates a URL according to the parameters received
        :param platform: Currency conversion platform
        :param web_id: Endpoint Id of Platform
        :param params:
                    from: Source currency
                    to: Final currency
                    amount: Value to be converted
        :param system: System of Platform
        :return: URL criada
        """
        srv = self.config[platform]['server']
        access_key_value = self.config[platform]['access_key_value']
        access_key_id = self.config[platform]['access_key_id']
        controller_type_values = self.config[platform]['endpoints']

        try:
            val_ctrl_type = controller_type_values[web_id]
        except KeyError:
            raise ValueError(
                f"invalid value to 'web_id': {web_id}")
        else:
            if access_key_value is not None:
                val_ctrl_type = val_ctrl_type.replace("[access_key_id]", access_key_id)
                val_ctrl_type = val_ctrl_type.replace("[access_key_value]", access_key_value)
            val_ctrl_type = val_ctrl_type.replace("[srv]", srv)
            val_ctrl_type = val_ctrl_type.replace("[params]", params)
            return val_ctrl_type

    def get_value_by_web_id(self, platform, web_id, parameters, system):
        web_api_url = self.__create_url_web_api(
            platform=platform,
            web_id=web_id,
            params=parameters,
            system=system
        )
        return self.__get_response(platform=platform, url=web_api_url)  # .json()
