export type Levels = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

export interface LogObject {
    [key: string]: any
}

export interface ErrorObject extends LogObject {
    err?: Error
}

export interface Logger {
    trace(msg: string | LogObject): void
    trace(obj: LogObject, msg: string): void
    debug(msg: string | LogObject): void
    debug(obj: LogObject, msg: string): void
    info(msg: string | LogObject): void
    info(obj: LogObject, msg: string): void
    warn(msg: string): void
    warn(obj: LogObject, msg: string): void
    error(msg: string): void
    error(obj: ErrorObject, msg: string): void
    fatal(msg: string): void
    fatal(obj: ErrorObject, msg: string): void

    child(childObj: LogObject): Logger
}

export function noopLogger() {
    return {
        // tslint:disable:no-empty
        trace: () => {},
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
        fatal: () => {},
        child: () => noopLogger(),
    }
}

const levelNumber: { [level in Levels]: number } = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
}
export function consoleLogger(
    level: Levels = 'warn',
    context?: LogObject,
): Logger {
    // tslint:disable:no-console
    // tslint:disable:no-unused-expression
    return {
        trace: (...rest: any[]) => {
            levelNumber[level] <= 0 &&
                (context
                    ? console.log('TRACE', ...rest)
                    : console.log('TRACE', context, ...rest))
        },
        debug: (...rest: any[]) => {
            levelNumber[level] <= 1 &&
                (context
                    ? console.log('DEBUG', ...rest)
                    : console.log('DEBUG', context, ...rest))
        },
        info: (...rest: any[]) => {
            levelNumber[level] <= 2 &&
                (context
                    ? console.log(' INFO', ...rest)
                    : console.log(' INFO', context, ...rest))
        },
        warn: (...rest: any[]) => {
            levelNumber[level] <= 3 &&
                (context
                    ? console.log(' WARN', ...rest)
                    : console.log(' WARN', context, ...rest))
        },
        error: (...rest: any[]) => {
            levelNumber[level] <= 4 &&
                (context
                    ? console.log('ERROR', ...rest)
                    : console.log('ERROR', context, ...rest))
        },
        fatal: (...rest: any[]) => {
            levelNumber[level] <= 5 &&
                (context
                    ? console.log('FATAL', ...rest)
                    : console.log('FATAL', context, ...rest))
        },
        child: (childObj: LogObject) =>
            consoleLogger(
                level,
                context ? { ...context, ...childObj } : { ...childObj },
            ),
    }
}
