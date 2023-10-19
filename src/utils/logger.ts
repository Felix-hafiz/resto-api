import pino from 'pino'

const transport = pino.transport({
    targets: [
        // {
        //     target: 'pino/file',
        //     level: 'info',
        //     options: { destination: `./../log/server.log` },
        // },
        {
            target: 'pino-pretty',
            options: {},
            level: 'info',
        },
    ],
})

export default pino(
    {
        level: 'info',
    },
    transport,
)
