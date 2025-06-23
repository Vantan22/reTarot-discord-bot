export async function assignRole(member, roleId) {
  try {
    await member.roles.add(roleId);
  } catch (error) {
    console.error(`Failed to assign role to ${member.user.tag}:`, error);
  }
}
export async function removeRole(member, roleId) {
  try {
    await member.roles.remove(roleId);
    console.log(`Removed role ${roleId} from ${member.user.tag}`);
  } catch (error) {
    console.error(`Failed to remove role from ${member.user.tag}:`, error);
  }
}
