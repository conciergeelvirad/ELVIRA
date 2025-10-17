import { useSendStaffCalendar } from "../../../../../../hooks/queries/hotel-management/staff/useSendStaffCalendar";
import { useConfirmDialog } from "../../../../../../hooks/ui/useConfirmDialog";
import { useToast } from "../../../../../../hooks/ui";

/**
 * Hook to handle calendar email sending with confirmation and success dialogs
 */
export const useSendCalendarEmails = (hotelId: string | null) => {
  const { toast } = useToast();
  const { mutate: sendCalendar, isPending: isSending } = useSendStaffCalendar();
  const { confirm, dialog } = useConfirmDialog();
  const successDialog = useConfirmDialog();

  const handleSendCalendar = async () => {
    console.log("🎯 handleSendCalendar triggered");
    console.log("🏨 Current hotelId:", hotelId);

    if (!hotelId) {
      console.error("❌ No hotel ID available");
      toast({
        type: "error",
        message: "Hotel ID not found. Please try again.",
      });
      return;
    }

    console.log("📋 Showing confirmation dialog...");
    const confirmed = await confirm({
      title: "Send Calendar Emails",
      message: `This will send schedule emails to all active staff members with their upcoming shifts for the next 30 days. Do you want to continue?`,
      confirmText: "Send Emails",
      cancelText: "Cancel",
      variant: "info",
    });

    console.log("✅ User confirmation:", confirmed);

    if (!confirmed) {
      console.log("❌ User cancelled the operation");
      return;
    }

    console.log("🚀 Initiating calendar email send...");
    console.log("📤 Sending request with hotelId:", hotelId);

    sendCalendar(
      { hotelId },
      {
        onSuccess: async (data) => {
          console.log("====================================");
          console.log("🎉 CALENDAR EMAIL SUCCESS");
          console.log("====================================");
          console.log("📊 Full response data:", data);
          console.log("👥 Total staff:", data.totalStaff);
          console.log("✅ Successful emails:", data.successfulEmails);
          console.log("❌ Failed emails:", data.failedEmails);
          console.log("📧 Recipient:", data.recipient);
          console.log("📋 Email results:", data.emailResults);
          console.log("====================================");

          // Show success confirmation modal
          await successDialog.confirm({
            title: "Calendar Emails Sent Successfully!",
            message: `📧 ${data.successfulEmails} out of ${
              data.totalStaff
            } emails sent successfully${
              data.failedEmails > 0
                ? `\n\n⚠️ ${data.failedEmails} email(s) failed to send. Please check the logs for details.`
                : ""
            }`,
            confirmText: "OK",
            variant: "success",
          });

          toast({
            type: "success",
            message: `Calendar emails sent! ${data.successfulEmails}/${data.totalStaff} successful`,
          });
        },
        onError: (error) => {
          console.error("====================================");
          console.error("💥 CALENDAR EMAIL ERROR");
          console.error("====================================");
          console.error("Error object:", error);
          console.error("Error message:", error.message);
          console.error("Error name:", error.name);
          console.error("Error stack:", error.stack);
          console.error("====================================");

          toast({
            type: "error",
            message:
              error.message ||
              "Failed to send calendar emails. Please try again.",
          });
        },
      }
    );
  };

  return {
    handleSendCalendar,
    isSending,
    confirmDialog: dialog,
    successDialog: successDialog.dialog,
  };
};
