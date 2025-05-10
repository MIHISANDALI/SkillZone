import React, { useState } from 'react';
import axios from 'axios';

function AddLearningPlan() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [milestones, setMilestones] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const milestoneList = milestones.split(',').map(m => m.trim());
    await axios.post('/api/learning-plans', {
      title,
      description,
      milestones: milestoneList,
      isPublic,
      userId: "123" // dynamically set this
    });
    alert('Learning Plan Created!');
  };

  return (
    <div>
      <h2>Create Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="text" placeholder="Milestones (comma separated)" value={milestones} onChange={e => setMilestones(e.target.value)} required />
        <label>
          Public:
          <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default AddLearningPlan;
