const supabase = require('../supabaseClient');

// GET all products
exports.getProducts = async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
  if (error) return res.status(500).json({ error });
  res.json(data);
};

// GET one product by ID
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: "Product not found" });
  res.json(data);
};

// CREATE a new product
exports.createProduct = async (req, res) => {
  const { data, error } = await supabase.from('products').insert([req.body]).select().single();
  if (error) return res.status(500).json({ error });
  res.status(201).json(data);
};

// UPDATE a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').update(req.body).eq('id', id).select().single();
  if (error) return res.status(500).json({ error });
  res.json(data);
};

// DELETE a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(500).json({ error });
  res.json({ message: `Product ${id} deleted successfully.` });
};
