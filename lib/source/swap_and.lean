theorem swap_and (A B : Prop) (h : A ∧ B) : B ∧ A := by
  constructor
  · exact h.right
  · exact h.left
