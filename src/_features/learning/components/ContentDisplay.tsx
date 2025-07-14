import ThemedButton from '@/src/components/ui/atoms/ThemedButton'
import ThemedText from '@/src/components/ui/atoms/ThemedText'
import ThemedView from '@/src/components/ui/atoms/ThemedView'
import { Image } from 'expo-image'
import * as Linking from 'expo-linking'
import { StyleSheet, View } from 'react-native'
import { BJJNode, ContentItem } from '../data/types'

type ContentDisplayProps = {
  node: BJJNode | null
}

const renderContentItem = (item: ContentItem, index: string | number) => {
  switch (item.type) {
    case 'paragraph':
      return (
        <ThemedText key={index.toString()} style={styles.paragraph}>
          {item.text}
        </ThemedText>
      )
    case 'image':
      return <Image key={index.toString()} source={{ uri: item.src }} style={styles.image} contentFit="cover" />
    case 'video':
      return (
        <View key={index.toString()} style={styles.videoContainer}>
          <ThemedText style={styles.videoTitle}>{item.title}</ThemedText>
          <ThemedButton title="Watch Video" onPress={() => item.url && Linking.openURL(item.url)} />
        </View>
      )
    case 'list':
      return (
        <View key={index.toString()} style={styles.list}>
          {item.items.map((listItem: string, i: number) => (
            <ThemedText key={i} style={styles.listItem}>
              • {listItem}
            </ThemedText>
          ))}
        </View>
      )
    default:
      return null
  }
}

export default function ContentDisplay({ node }: ContentDisplayProps) {
  if (!node || !node.content) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Select a topic to see the details.</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {node.title}
      </ThemedText>
      {node.content.introduction &&
        node.content.introduction.map((item: ContentItem, index: number) =>
          renderContentItem(item, `intro-${index}`)
        )}

      {node.content.sections &&
        node.content.sections.map((section, sectionIndex) => (
          <View key={`section-${sectionIndex}`} style={styles.sectionContainer}>
            {section.title && (
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
            )}
            {section.items.map((item: ContentItem, itemIndex: number) =>
              renderContentItem(item, `section-${sectionIndex}-item-${itemIndex}`)
            )}
          </View>
        ))}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 15,
    lineHeight: 24,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  videoContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  videoTitle: {
    marginBottom: 10,
    color: '#fff',
  },
  list: {
    marginBottom: 15,
    marginLeft: 10,
  },
  listItem: {
    marginBottom: 8,
    lineHeight: 22,
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
})
