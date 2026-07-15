# Database

## 1. Equipments

| id  | name        | quantity | picture                                 | deleted |
| --- | ----------- | -------- | --------------------------------------- | ------- |
| 1   | Equipment 1 | 5        | /public/equipment-images/equipment1.jpg | false   |

`deleted` marks an equipment row as soft-deleted. Deleted equipment stays in the database so existing borrowings keep the same `equipmentId`.

### Adding New Equipment

To add new equipment, use the **Add Equipment** page accessible from `/add-equipment`. The form accepts:

- **Equipment Title** (required): Name of the equipment
- **Quantity** (required): Number of items (must be > 0)
- **Picture** (optional): Image file stored in `public/equipment-images`, with the public URL saved in the `picture` field

The form validates input, displays a preview of the selected image before submission, and stores the uploaded file outside the database.

## 2. Borrowings

| id  | equipmentId | class | borrowedAt | returnedAt |
| --- | ----------- | ----- | ---------- | ---------- |
| 1   | 1           | 1A    | 2024-01-01 | 2024-01-10 |

## 3. Deductions

**Note**: Deductions are stored as positive values.

| id  | className | content                  | points | occurredAt |
| --- | --------- | ------------------------ | ------ | ---------- |
| 1   | 1A        | Late return of equipment | 5      | 2024-01-11 |

## 4. Others

`announcements`, `ammouncementsClasses`, `announcementsRelations` and `announcementClasses` tables are exist but not used.
It's existing for the new features.
