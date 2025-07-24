import ContentDisplay from '@/src/_features/learning/components/ContentDisplay'
import Tree from '@/src/_features/learning/components/Tree'
import { BJJ_CONTENT_TREE } from '@/src/_features/learning/data/learningContents'
import { BJJNode } from '@/src/_features/learning/data/types'
import ThemedView from '@/src/components/ui/atoms/ThemedView'
import { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function LearnPage() {
  const [selectedNode, setSelectedNode] = useState<BJJNode | null>(BJJ_CONTENT_TREE[0])

  const handleSelectNode = (node: BJJNode) => {
    setSelectedNode(node)
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mindMapContainer}>
        <Tree onSelectNode={handleSelectNode} selectedNodeId={selectedNode?.id || null} />
      </View>
      <View style={styles.contentContainer}>
        <ScrollView>
          <ContentDisplay node={selectedNode} />
        </ScrollView>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mindMapContainer: {
    flex: 2, // Takes up 2/3 of the screen
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  mindMapScrollView: {
    padding: 20,
  },
  contentContainer: {
    flex: 1, // Takes up 1/3 of the screen
  },
})