const AlignmentLineControl = ({ onPositionChange }) => {
    const [position, setPosition] = useState('');
  
    const handlePositionChange = (event) => {
      const newPosition = parseFloat(event.target.value);
      setPosition(newPosition);
      onPositionChange(newPosition);
    };
  
    return (
      <div>
        <label htmlFor="alignmentLinePosition">Alignment Line Position:</label>
        <input
          type="number"
          id="alignmentLinePosition"
          value={position}
          onChange={handlePositionChange}
        />
      </div>
    );
  };
  