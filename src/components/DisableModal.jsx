const DisableModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[350px] text-center">
        <h2 className="text-xl font-semibold mb-3">Disable Profile</h2>
        <p className="mb-5 text-gray-600">Are you sure you want to disable this user's profile?</p>

        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="border border-orange-600 text-orange-600 px-4 py-2 rounded-md">
            No
          </button>
          <button onClick={onConfirm} className="bg-orange-600 text-white px-6 py-2 rounded-md">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisableModal;
