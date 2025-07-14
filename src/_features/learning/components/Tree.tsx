import React, { useCallback, useMemo, useState } from 'react'
import { LayoutChangeEvent, ScrollView, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { BJJ_CONTENT_TREE } from '../data/learningContents'
import { BJJNode } from '../data/types'
import MindMap from './MindMap'

// Enables layout animations for a smoother UX
import { LayoutAnimation, UIManager } from 'react-native'

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

// Defines the props for the Tree component for clear type-checking
type TreeProps = {
  onSelectNode: (node: BJJNode) => void
  selectedNodeId: string | null
}

const Tree = ({ onSelectNode, selectedNodeId }: TreeProps) => {
  // State to manage the layout of each node in the tree
  const [layouts, setLayouts] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({})
  // State to track expanded nodes, initialized with the root node expanded
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ [BJJ_CONTENT_TREE[0].id]: true })

  // Memoized function to calculate paths between nodes for rendering connecting lines
  const paths = useMemo(() => {
    const newPaths: string[] = []
    const queue = [...BJJ_CONTENT_TREE]

    // Traverse the tree to generate paths for expanded nodes
    while (queue.length > 0) {
      const node = queue.shift()
      if (!node || !expandedNodes[node.id]) continue

      const parentLayout = layouts[node.id]
      if (node.children) {
        node.children.forEach((child) => {
          const childLayout = layouts[child.id]
          if (parentLayout && childLayout) {
            // Generates a curved path from parent to child for a mind map aesthetic
            const startX = parentLayout.x + parentLayout.width / 2
            const startY = parentLayout.y + parentLayout.height
            const endX = childLayout.x + childLayout.width / 2
            const endY = childLayout.y
            // Vertical S-curve for column layout
            newPaths.push(`M${startX},${startY} C${startX},${startY + 60} ${endX},${endY - 60} ${endX},${endY}`)
          }
          queue.push(child)
        })
      }
    }
    return newPaths
  }, [layouts, expandedNodes])

  // Handles node layout changes and updates the state
  const handleLayout = useCallback((nodeId: string, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout
    setLayouts((prev) => ({ ...prev, [nodeId]: { x, y, width, height } }))
  }, [])

  // Toggles the expanded state of a node
  const handleToggleExpand = useCallback((nodeId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }))
  }, [])

  // Renders a node and its children recursively
  const renderNode = (node: BJJNode, level = 0) => {
    const isExpanded = !!expandedNodes[node.id]
    return (
      <View key={node.id} onLayout={(event) => handleLayout(node.id, event)} style={{ alignItems: 'center', marginVertical: 20 }}>
        <MindMap
          node={node}
          onSelectNode={onSelectNode}
          selectedNodeId={selectedNodeId}
          onToggleExpand={() => handleToggleExpand(node.id)}
          isExpanded={isExpanded}
        />
        {isExpanded && node.children && (
          <View style={{ marginLeft: 300, flexDirection: 'column', alignItems: 'flex-start' }}>
            {node.children.map((child: BJJNode) => (
              <View key={child.id} style={{ alignItems: 'center' }}>
                {renderNode(child, level + 1)}
              </View>
            ))}
          </View>
        )}
      </View>
    )
  }

  // Gets the overall height of the tree for the SVG canvas
  const treeHeight = useMemo(() => {
    return Object.values(layouts).reduce((max, layout) => Math.max(max, layout.y + layout.height), 0) + 200
  }, [layouts])

    const treeWidth = useMemo(() => {
    return Object.values(layouts).reduce((max, layout) => Math.max(max, layout.x + layout.width), 0) + 200
  }, [layouts])


  return (
    <ScrollView horizontal>
		<ScrollView>
			<View style={{ position: 'relative', minHeight: treeHeight, minWidth: treeWidth }}>
				<Svg height="100%" width="100%" style={{ position: 'absolute' }}>
				{paths.map((d, i) => (
					<Path key={i} d={d} stroke="gray" strokeWidth="1" fill="transparent" />
				))}
				</Svg>
				<View style={{ padding: 20, alignItems: 'center' }}>{BJJ_CONTENT_TREE.map((node: BJJNode) => renderNode(node))}</View>
			</View>
		</ScrollView>
    </ScrollView>
  )
}

export default Tree 