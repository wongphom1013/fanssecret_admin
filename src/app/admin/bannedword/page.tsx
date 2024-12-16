import AddWord from "@/components/AddWord";
import BannedNotifications from "@/components/BannedDetect";

const BannedWord = () => {
  return (
    <div className="flex gap-4 p-8">
      <div className="w-1/4">
        <AddWord />
      </div>
      <div className="w-3/4">
        <BannedNotifications />
      </div>
    </div>
  );
};

export default BannedWord;