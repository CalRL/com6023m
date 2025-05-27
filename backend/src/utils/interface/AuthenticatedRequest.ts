import {User} from '../../models/UserModel.js';

export interface AuthenticatedRequest extends Request {
    user?: Partial<User>;
}
