import { useState, useEffect } from 'react';
import Link from 'next/link';

// Sample data to replace API calls for demonstration
const d = [
  {
    createdAt: '2022-02-26 09:06:08',
    remarks: 'Configure data lake',
    isCurrentVersion: false,
    isDraft: true,
  },
  {
    createdAt: '2022-02-22 12:57:31',
    remarks: 'Add data ingress',
    isCurrentVersion: true,
    isDraft: false,
  },
  {
    createdAt: '2022-05-20 12:57:31',
    remarks: 'Initial data lake structure',
    isCurrentVersion: false,
    isDraft: false,
  },
];

const useStyles = () => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#fff', // Default to light mode for simplicity
    transition: 'box-shadow 150ms ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: '1px solid #ccc',
    },
  },
  scrolled: {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
});

function TerraformHistory() {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate an API call
    setData({
      status: 'SUCCESS',
      result: d,
    });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data.status === 'FAILURE') {
    console.error('Get History Error', data.result.Reason);
  }

  const rows = data.result.map((row, id) => (
    <tr key={id}>
      <td>{row.createdAt}</td>
      <td>{row.remarks}</td>
      <td>
        {/* Mockup for badges */}
        {row.isCurrentVersion && <span>Current Version</span>}
        {row.isDraft && <span>Draft</span>}
      </td>
      <td>
        {/* Actions can be links or buttons that trigger modals or other components */}
        {row.isDraft && (
          <Link href={`/terraform/${id}`}>Edit</Link>
        )}
        {!row.isDraft && (
          <Link href={`/terraform/${id}`}>Duplicate</Link>
        )}
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Terraform Deployment History</h1>
      {rows}
    </div>
  );
}

export default TerraformHistory;
