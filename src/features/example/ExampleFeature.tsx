import { Button, Card, CardHeader, CardContent } from '../../components/common';

export const ExampleFeature = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Example Feature</h2>

      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900">
            Welcome to Your Web Design Project
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            This is a well-structured project with clean architecture and best practices.
            Start building your features here!
          </p>
          <div className="flex gap-3">
            <Button variant="primary">Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
