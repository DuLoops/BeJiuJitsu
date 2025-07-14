import { StyleSheet, TouchableOpacity, View } from 'react-native'
import ThemedText from '../../../components/ui/atoms/ThemedText'
import { BJJNode } from '../data/types'

type MindMapNodeProps = {
  node: BJJNode
  onSelectNode: (node: BJJNode) => void
  selectedNodeId: string | null
  onToggleExpand: () => void
  isExpanded: boolean
}

const MindMapNode = ({
  node,
  onSelectNode,
  selectedNodeId,
  onToggleExpand,
  isExpanded,
}: MindMapNodeProps) => {
  const handleSelect = () => {
    onSelectNode(node)
    if (!isExpanded) {
      onToggleExpand()
    }
  }

  const isSelected = selectedNodeId === node.id

  return (
    <View style={styles.nodeContainer}>
      <TouchableOpacity
        onPress={handleSelect}
        onLongPress={onToggleExpand}
        style={[styles.node, isSelected && styles.selectedNode]}
      >
        <ThemedText style={styles.nodeTitle}>{node.title}</ThemedText>
      </TouchableOpacity>
    </View>
  )
}

export default MindMapNode

const styles = StyleSheet.create({
  nodeContainer: {
    marginVertical: 5,
  },
  node: {
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 150,
    alignItems: 'center',
  },
  selectedNode: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
    borderWidth: 2,
  },
  nodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
}) 