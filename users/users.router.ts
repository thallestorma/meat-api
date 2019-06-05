import * as restify from 'restify'
import { ModelRouter } from '../common/model-router'
import { User } from './users.model'

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
        })
    }

    findByEmail = (req, resp, next) => {
        if(req.query.email) {
            User.find({email: req.query.email})
                .then(this.renderAll(resp, next))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server) {
        application.get({path: '/users', version: '2.0.0'}, [this.findByEmail, this.findAll])
        application.get({path: '/users', version: '1.0.0'}, this.findAll)
        application.get('/users/:id', [this.validateId, this.findById])
        application.post('/users', this.save)
        application.put('/users/:id', [this.validateId, this.replace])
        application.patch('/users/:id', [this.validateId, this.update])
        application.del('/users/:id', [this.validateId, this.delete])
    }
}

export const usersRouter = new UsersRouter()