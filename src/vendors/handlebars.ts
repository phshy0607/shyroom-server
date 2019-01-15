import * as handlebars from 'express-handlebars'
import * as path from 'path'

const layoutPath: string = path.resolve(process.cwd(), 'src/views/layouts')

const instance: Exphbs = handlebars.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
      iter: (context: object[], options: {fn: Function; inverse: Function}): string => {
        const fn: Function = options.fn
        const inverse: Function = options.inverse
        let ret: string = ''

        if (context && context.length > 0) {
          for (let i: number = 0; i < context.length; i = i + 1) {
            ret = ret + fn({
              ...context[i],
              i: i,
              iPlus1: i + 1
            })
          }
        } else {
          ret = inverse(this)
        }

        return ret
      }
  },
  defaultLayout: 'main',
  layoutsDir: path.join(process.cwd(), 'src/views/layouts')
})

export const engine: Function = instance.engine
