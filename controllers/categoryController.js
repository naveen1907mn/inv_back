const supabase = require('../supabaseClient');

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error in getCategories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 