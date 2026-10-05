process.env.NODE_ENV = 'development'
process.argv.splice(2, 0, 'dev')
require('next/dist/bin/next')
