import { TemplateEntity } from "../../../../data/templateData";

// TODO: Update this component to display your entity details
export const TemplateDetail = ({ item }: { item: TemplateEntity }) => (
  <div className="p-4 space-y-4">
    <div>
      <h3 className="font-medium text-gray-700">Name</h3>
      <p>{item.name}</p>
    </div>
    <div>
      <h3 className="font-medium text-gray-700">Description</h3>
      <p>{item.description}</p>
    </div>
    <div>
      <h3 className="font-medium text-gray-700">Category</h3>
      <p>{item.category}</p>
    </div>
    <div>
      <h3 className="font-medium text-gray-700">Priority</h3>
      <p>{item.priority}</p>
    </div>
    <div>
      <h3 className="font-medium text-gray-700">Status</h3>
      <p>{item.status}</p>
    </div>
    <div>
      <h3 className="font-medium text-gray-700">Created</h3>
      <p>{item.created}</p>
    </div>

    {/* TODO: Add more fields specific to your entity */}
  </div>
);
