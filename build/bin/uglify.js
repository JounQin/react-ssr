import NodeUglifier from 'node-uglifier'

const fileName = 'dist/server-bundle.js'

const nodeUglifier = new NodeUglifier(fileName)

nodeUglifier.merge().uglify()

nodeUglifier.exportToFile(fileName)
