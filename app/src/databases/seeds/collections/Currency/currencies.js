import { getObjectId } from 'mongo-seeding';
import constants from '../../../../config/constants';

export default constants.DEFAULT_AVAILABLE_CURRENCIES.map(currency => (
    { 
        '_id': getObjectId(currency),
        'currency': currency 
    }
));