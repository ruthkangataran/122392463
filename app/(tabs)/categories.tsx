import { useEffect, useState } from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '@/components/ui/screen-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {useTheme} from "@/context/ThemeContext";

type Category = {
  id: number;
  name: string;
  color: string;
  icon: string | null;
};

const colorOptions = [
  '#1446A0',
  '#FF7F11',
  '#DB3069',
  '#F5D547',
  '#ADBDFF',
  '#2E8B57',
  '#8B5CF6',
  '#E11D48',
];

export default function CategoriesScreen() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const {theme} = useTheme();

  useEffect(() => {
    void loadCategories();
  }, []);

  const loadCategories = async () => {
    const rows = await db.select().from(categoriesTable);
    setCategoryList(rows);
  };

  const resetForm = () => {
    setName('');
    setSelectedColor(colorOptions[0]);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (cat: Category) => {
    setName(cat.name);
    setSelectedColor(cat.color);
    setEditingId(cat.id);
    setShowForm(true);
  };

  const startAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const saveCategory = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a category name');
      return;
    }

    if (editingId) {
      await db
        .update(categoriesTable)
        .set({ name: name.trim(), color: selectedColor })
        .where(eq(categoriesTable.id, editingId));
    } else {
      await db.insert(categoriesTable).values({
        name: name.trim(),
        color: selectedColor,
        icon: null,
      });
    }

    resetForm();
    await loadCategories();
  };

  const deleteCategory = (cat: Category) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${cat.name}"? Runs using this category may be affected.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await db.delete(categoriesTable).where(eq(categoriesTable.id, cat.id));
            await loadCategories();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title="Categories" subtitle="Manage your run types" />

      {/* Category list */}
      {categoryList.map((cat) => (
        <View key={cat.id} style={[styles.categoryCard, { borderLeftColor: cat.color, backgroundColor: theme.card }]}>
          <Text style={[styles.categoryName, {color: theme.text}]}>{cat.name}</Text>
          <Pressable
            onPress={() => startEdit(cat)}
            accessibilityLabel={`Edit ${cat.name}`}
            style={styles.iconButton}
          >
            <Ionicons name="pencil-outline" size={18} color="#64748B" />
          </Pressable>
          <Pressable
            onPress={() => deleteCategory(cat)}
            accessibilityLabel={`Delete ${cat.name}`}
            style={styles.iconButton}
          >
            <Ionicons name="trash-outline" size={18} color="#C53030" />
          </Pressable>
        </View>
      ))}

      {/* Add/Edit form */}
      {showForm ? (
        <View style={[styles.formCard, {backgroundColor: theme.card}]}>
          <Text style={[styles.formTitle, {color: theme.text}]}>
            {editingId ? 'Edit Category' : 'New Category'}
          </Text>

          <Text style={[styles.label, {color: theme.text}]}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, {backgroundColor: theme.background, color: theme.text}]}
          />

          <Text style={[styles.label, {color: theme.text}]}>Colour</Text>
          <View style={styles.colorRow}>
            {colorOptions.map((color) => (
              <Pressable
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color ? styles.colorCircleSelected : null,
                ]}
              />
            ))}
          </View>

          <PrimaryButton
            label={editingId ? 'Save Changes' : 'Add Category'}
            onPress={saveCategory}
          />
          <View style={styles.buttonSpacing}>
            <PrimaryButton label="Cancel" variant="secondary" onPress={resetForm} />
          </View>
        </View>
      ) : (
        <View style={styles.addButtonWrapper}>
          <PrimaryButton label="Add Category" onPress={startAdd} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // Category card
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 10,
    padding: 14,
  },
  categoryName: {
    color: '#0F172A',
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  iconButton: {
    marginLeft: 10,
    padding: 4,
  },

  // Form
  formCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  formTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    color: '#0F172A',
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  colorCircle: {
    borderRadius: 999,
    height: 36,
    width: 36,
  },
  colorCircleSelected: {
    borderColor: '#0F172A',
    borderWidth: 3,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  addButtonWrapper: {
    marginTop: 20,
  },
});